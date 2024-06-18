# Step 1: Build the React application
FROM node:18-alpine as build


# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock или package-lock.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .


# Step 2: Build the production image
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock или package-lock.json
COPY package.json ./

# Устанавливаем только production-зависимости
RUN npm install 

# Копируем файлы Prisma
COPY prisma ./prisma


# Копируем исходные коды
COPY . .

# # Выполняем миграции Prisma
# RUN npx prisma migrate deploy

# Экспонируем порт (если ваше приложение требует порта)
EXPOSE 3000

# Команда запуска контейнера
CMD [ "npm", "run", "dev"]