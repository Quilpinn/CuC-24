FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

ARG API_URL=http://localhost:8484
ENV NEXT_PUBLIC_API_URL=$API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]