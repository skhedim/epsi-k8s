# EPSI Kubernetes

## Overview

This repo contains all the exercises of the course on Kubernetes. Before starting the labs please prepare the necessary environment by following the steps below.

All necessary programs are compatible with Windows, Linux or MacOS. The documentation will be based on Windows, but the commands are easily adaptable.

## Prerequisites

You will need to download and install the following programs to set up the lab environment:

- Vagrant: https://www.vagrantup.com/downloads.html
- VirtualBox: https://www.virtualbox.org/wiki/Downloads
- Visual Studio Code (optional): https://code.visualstudio.com/download
- OpenSSH Server (Windows): https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse

## Deploy Ubuntu VM

Once everything is installed run powershell and execute the following commands:

```powershell
vagrant init ubuntu/bionic64
```

Edit the Vagrantfile, and add the following line at the end of the file.

```bash
config.vm.network :forwarded_port, guest: 30000, host: 8080
config.vm.provider "virtualbox" do |vb|
  vb.memory = "2048"
end
```

Finally start the VM creation with the follwing command:

```sh
vagrant up
```

Once the command is finished you should be able to retrieve the configuration of the ubuntu VM, in order to use it with OpenSSH.

```powershell
vagrant ssh-config > "%HOMEPATH%\.ssh\config"
```

Now you should be able to SSH connect to the VM using the command:

```powershell
ssh default
vagrant@ubuntu-bionic:~$
```

## Connect Visual Studio Code inside the VM

> This step is not mandatory but recommended

It is possible to use visual studio code in a VM. The interest is that you can edit your YAML and Dockerfile more easily and also take advantage of the kuberentes and Docker extensions proposed by VSC.

Just follow this tutorial to install the extension, then just choose default in the menu to connect you VSC into the Ubuntu VM.

[Visual Studio Code SSH Remote Access](https://code.visualstudio.com/blogs/2019/07/25/remote-ssh#_connect-using-remote-ssh)