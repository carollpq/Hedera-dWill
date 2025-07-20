# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

