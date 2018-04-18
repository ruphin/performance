FROM ruphin/webdev

COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT npm run start