/*
 * The MIT License
 * Copyright (c) 2019- Nordic Institute for Interoperability Solutions (NIIS)
 * Copyright (c) 2018 Estonian Information System Authority (RIA),
 * Nordic Institute for Interoperability Solutions (NIIS), Population Register Centre (VRK)
 * Copyright (c) 2015-2017 Estonian Information System Authority (RIA), Population Register Centre (VRK)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package org.niis.xroad.common.core.exception;

import ee.ria.xroad.common.HttpStatus;

import java.util.UUID;

/**
 * Builder class for constructing XrdRuntimeException instances.
 * Provides a fluent API for setting exception properties.
 */
@SuppressWarnings("checkstyle:HiddenField")
public class XrdRuntimeExceptionBuilder {
    private Throwable cause;
    private String identifier;
    private final ExceptionCategory category;

    private final DeviationBuilder.ErrorDeviationBuilder errorDeviation;
    private Object[] metadataItems;

    private String details;
    private HttpStatus httpStatus;
    private ErrorOrigin origin;

    public XrdRuntimeExceptionBuilder(ExceptionCategory category, DeviationBuilder.ErrorDeviationBuilder errorDeviation) {
        if (category == null) {
            throw new IllegalArgumentException("ExceptionCategory cannot be null");
        }
        if (errorDeviation == null) {
            throw new IllegalArgumentException("ErrorDeviationBuilder cannot be null");
        }

        this.category = category;
        this.errorDeviation = errorDeviation;
    }

    /**
     * Sets the cause of this exception.
     *
     * @param cause the underlying cause
     * @return this builder instance
     */
    public XrdRuntimeExceptionBuilder cause(Throwable cause) {
        this.cause = cause;
        return this;
    }

    /**
     * Sets a custom identifier for this exception.
     *
     * @param identifier the unique identifier
     * @return this builder instance
     * @throws IllegalArgumentException if identifier is null or blank
     */
    public XrdRuntimeExceptionBuilder identifier(String identifier) {
        this.identifier = identifier;
        return this;
    }

    /**
     * Sets metadata items for error deviation formatting.
     *
     * @param metadataItems variable arguments for metadata
     * @return this builder instance
     */
    public XrdRuntimeExceptionBuilder metadataItems(Object... metadataItems) {
        this.metadataItems = metadataItems;
        return this;
    }

    /**
     * Sets additional details for this exception.
     *
     * @param details the detailed description
     * @return this builder instance
     */
    public XrdRuntimeExceptionBuilder details(String details) {
        this.details = details;
        return this;
    }

    /**
     * Set the HTTP status for this exception.
     * This is optional and can be used to indicate the HTTP status code
     * that should be returned in a web context.
     *
     * @param httpStatus the HTTP status to set
     * @return this builder instance
     */
    public XrdRuntimeExceptionBuilder httpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }


    public XrdRuntimeExceptionBuilder origin(ErrorOrigin origin) {
        this.origin = origin;
        return this;
    }

    /**
     * Builds the XrdRuntimeException with all configured properties.
     * Generates a random UUID identifier if none was specified.
     *
     * @return the constructed exception
     * @throws IllegalStateException if required parameters are missing
     */
    public XrdRuntimeException build() {
        if (identifier == null) {
            identifier = UUID.randomUUID().toString();
        }

        var deviation = errorDeviation.build(metadataItems);
        if (cause != null) {
            return new XrdRuntimeException(
                    cause,
                    identifier,
                    category,
                    resolveErrorCode(),
                    deviation.metadata(),
                    origin,
                    details,
                    httpStatus);
        }
        return new XrdRuntimeException(
                identifier,
                category,
                resolveErrorCode(),
                deviation.metadata(),
                origin,
                details,
                httpStatus);
    }

    private String resolveErrorCode() {

        if (origin != null) {
            return origin.toPrefix() + errorDeviation.code();
        }
        return errorDeviation.code();
    }
}
