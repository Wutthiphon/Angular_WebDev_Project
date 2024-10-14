FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build --prod

FROM --platform=linux/amd64 nginx AS runner
EXPOSE 80
COPY --from=builder /app/dist/web_dev_project/browser /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]