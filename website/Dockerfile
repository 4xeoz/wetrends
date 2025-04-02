FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Debug: Check Node version
RUN node -v

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "run", "dev"]
