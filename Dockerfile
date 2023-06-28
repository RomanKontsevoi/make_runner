# Используем официальный образ Node.js в качестве базового образа
FROM node:18.16.0

# Устанавливаем директорию приложения в контейнере
WORKDIR /app

COPY package.json .

# runs once when image is building
RUN npm install

# copy all files from the root folder of project
# to the root (or WORKDIR) folder of the image
COPY . .

EXPOSE 3020

CMD ["node", "index.js"]
