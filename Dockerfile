FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies: Python, pip, ffmpeg, yt-dlp
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && pip3 install --no-cache-dir --upgrade yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy files to container
COPY . .

# Install Node.js dependencies
RUN npm install

# Environment variable
ENV PORT=3000

# Expose port for Railway
EXPOSE 3000

# Start your bot
CMD ["node", "bot.js"]
