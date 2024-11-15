FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get upgrade -y 
RUN apt-get install -y nodejs
RUN mkdir lbdb
WORKDIR "/lbdb"
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ./dist ./dist

RUN npm install
ENTRYPOINT [ "node", "./dist/index.js" ]     

