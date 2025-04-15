FROM php:8.1-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk update && apk add --no-cache \
    git \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) gd \
    pdo_mysql \
    bcmath \
    curl \
    mbstring \
    openssl \
    xml \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copy application code
COPY . .

# Install Composer dependencies
RUN composer install --no-ansi --no-dev --no-interaction --no-progress --optimize-autoloader --ignore-platform-reqs

# Generate application key
RUN php artisan key:generate

# Set storage directory permissions
RUN chmod -R 775 storage bootstrap/cache

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm", "-F"]
