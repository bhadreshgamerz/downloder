FROM debian:bullseye-slim

# Install node, python3, ffmpeg, and yt-dlp
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    python3 \
    python3-pip \
    ffmpeg && \
    pip3 install --upgrade yt-dlp && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install Node dependencies
RUN npm install

# Set environment port
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "bot.js"]
