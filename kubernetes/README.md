# Kubernetes labs

Here are the different labs that correspond to the notions seen during the course. Please follow the numbering of the different labs as they are becoming increasingly difficult.

Please start by installing kubectl and minikube on your VM as shown below.

## Cluster deployment

### Overview

minikube implements a local Kubernetes cluster on macOS, Linux, and Windows.

minikube’s primary goals are to be the best tool for local Kubernetes application development and to support all Kubernetes features that fit.

minikube runs the latest stable release of Kubernetes, with support for standard Kubernetes features.

The installation will be done on linux, if you're on Windows or MacOS, you can also install minikube, but in order for everyone to work on the same environment, deploy a Linux VM and install minikube in it.

### Minikube Installation

Download and install minikube to /usr/local/bin:

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

```shell
sudo minikube start --vm-driver=none
```

### Install kubectl on Linux

Download the latest release with the command:

```sh
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl \
  && chmod +x ./kubectl && sudo mv ./kubectl /usr/local/bin/kubectl
```

Test to ensure the version you installed is up-to-date:

```sh
sudo mv /home/vagrant/.kube /home/vagrant/.minikube $HOME
sudo chown -R $USER $HOME/.kube $HOME/.minikube
kubectl version
```
