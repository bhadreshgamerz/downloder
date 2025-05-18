# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    pip3 install --upgrade yt-dlp && \
    apt-get clean

# Copy project files
COPY . .

# Install Node.js dependencies
RUN npm install

# Set environment port for Railway
ENV PORT=3000

# Expose the port (important for Railway)
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]
