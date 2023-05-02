FROM node:18.16.0-alpine3.17 AS builder
# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ARG YARN_VERSION=1.22.19
ENV NODE_ENV=${NODE_ENV}
ENV YARN_VERSION=${YARN_VERSION}
RUN npm i -g "yarn@$YARN_VERSION" "pm2@$PM2_VERSION" --force
WORKDIR /var/www/app
RUN chown node:node ./
USER node
COPY package.json yarn.lock ./
# Устанавливаем зависимости
RUN yarn --frozen-lockfile
COPY . .
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /var/www/app/dist /usr/share/nginx/html
# Add your nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
