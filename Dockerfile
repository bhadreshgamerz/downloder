# Use a stable Node.js base image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    pip3 install --upgrade yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy bot code
COPY . .

# Expose port for Express (Replit-style keepalive server)
EXPOSE 3000

# Run the bot
CMD ["node", "index.js"]
