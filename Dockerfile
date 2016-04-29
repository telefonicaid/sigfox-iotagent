FROM centos:6

RUN yum update -y && yum install -y wget \
  && wget http://ftp.rediris.es/mirror/fedora-epel/6/i386/epel-release-6-8.noarch.rpm && yum localinstall -y --nogpgcheck epel-release-6-8.noarch.rpm \
  && yum install -y git gcc-c++ make

RUN curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
RUN yum -y install nodejs

COPY . /opt/sigfox-iotagent
WORKDIR /opt/sigfox-iotagent
RUN npm install

ENTRYPOINT bin/iotagent.js