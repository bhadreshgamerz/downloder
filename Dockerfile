# Use official Node.js LTS image with Debian base
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    pip3 install --upgrade yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy rest of the bot files
COPY . .

# Expose port for web server (Express)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
