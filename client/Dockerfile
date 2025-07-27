FROM node:lts as base
WORKDIR /app
EXPOSE 3000
ENV NEXT_TELEMETRY_DEBUG=1

FROM base as production
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
