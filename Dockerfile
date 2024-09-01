FROM node:20 AS BUILD

# Create and change to the app directory.
WORKDIR /app

# Create a non-root user and set directory ownership
RUN groupadd -r nodeuser && \
  useradd -m -r -g nodeuser nodeuser && \
  chown nodeuser:nodeuser /app

USER nodeuser

# Copy the application source code
COPY --chown=nodeuser:nodeuser . .

# Install all dependencies needed for the build
RUN npm ci

# Run the build
RUN npm run build --ignore-scripts

FROM node:20 AS production

# Set the working directory
WORKDIR /app

# Create a non-root user and set directory ownership
RUN groupadd -r nodeuser && \
  useradd -m -r -g nodeuser nodeuser && \
  chown nodeuser:nodeuser /app

USER nodeuser

# Copy the build application from the previous stage
COPY --chown=nodeuser:nodeuser --from=build /app/dist ./dist
COPY --chown=nodeuser:nodeuser --from=build /app/package*.json ./

# Copy the migration files
COPY --chown=nodeuser:nodeuser ./src/infraestructure/database/postgres/migrations /app/dist/src/infraestructure/database/postgres/migrations

# Copy assets
COPY --chown=nodeuser:nodeuser ./src/assets /app/dist/src/assets

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Specifically, rebuild bcrypt here to ensure it matches the production environment
RUN npm rebuild bcrypt --build-from-source

# Copy production environment variables
COPY --chown=nodeuser:nodeuser .env.production .env.production

# Set node environment to production
ENV NODE_ENV=production

# Run the web service on container startup.
CMD [ "npm", "start" ]
