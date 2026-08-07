FROM node:22

WORKDIR /app

# Yarn 4 ships via corepack, which is bundled with Node but off by default.
# The version itself comes from the "packageManager" field in package.json.
RUN corepack enable

# Copy the files Yarn needs to resolve, so this layer caches on lockfile change
# only. .yarnrc.yml matters: it pins nodeLinker to node-modules.
COPY package.json yarn.lock .yarnrc.yml ./

# --immutable fails the build if yarn.lock would have to change, which is what
# you want in CI — it catches a lockfile that was never committed.
RUN yarn install --immutable

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN yarn build

# Expose port and start the app
EXPOSE 3000
CMD ["yarn", "dev"]
