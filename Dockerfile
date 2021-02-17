FROM nginx:stable

COPY dist/starter /opt/site/
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY port.pl /opt/port.pl
COPY run-nginx.sh /opt/run-nginx.sh

RUN chmod 755 /opt/run-nginx.sh

EXPOSE 4200

WORKDIR /opt

CMD ./run-nginx.sh
