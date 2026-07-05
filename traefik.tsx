[
    {
        "Id": "a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a",
        "Created": "2026-05-19T08:30:11.936987066Z",
        "Path": "/entrypoint.sh",
        "Args": [
            "--api.insecure=false",
            "--providers.docker=true",
            "--providers.docker.exposedbydefault=false",
            "--providers.docker.network=traefik-public",
            "--entrypoints.web.address=:80",
            "--entrypoints.websecure.address=:443",
            "--entrypoints.web.http.redirections.entryPoint.to=websecure",
            "--entrypoints.web.http.redirections.entryPoint.scheme=https",
            "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web",
            "--certificatesresolvers.myresolver.acme.email=devadminnserp@nsengineering.com.np",
            "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 2225,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2026-07-05T05:52:21.321967225Z",
            "FinishedAt": "2026-07-05T05:51:04.3688685Z"
        },
        "Image": "sha256:802adc80a7bb20a6766c9385c2ad547f0de98564cd20d31d0b6d8f726f906f66",
        "ResolvConfPath": "/var/lib/docker/containers/a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a/hostname",
        "HostsPath": "/var/lib/docker/containers/a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a/hosts",
        "LogPath": "/var/lib/docker/containers/a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a/a6b4130a26c4032b0f2f324834a3958be357caa05e1bc919c620a93d7c09fb4a-json.log",
        "Name": "/ns_erp_dev_traefik",
        "RestartCount": 0,
        "Driver": "overlayfs",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "docker-default",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": [
                "/var/run/docker.sock:/var/run/docker.sock:ro",
                "ns_erp_dev_traefik-certificates:/letsencrypt:rw"
            ],
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {
                    "max-file": "3",
                    "max-size": "10m"
                }
            },
            "NetworkMode": "traefik-public",
            "PortBindings": {
                "443/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": "443"
                    }
                ],
                "80/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": "80"
                    }
                ]
            },
            "RestartPolicy": {
                "Name": "unless-stopped",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "ConsoleSize": [
                0,
                0
            ],
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "private",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": [],
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 134217728,
            "NanoCpus": 250000000,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": null,
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": null,
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "MemoryReservation": 33554432,
            "MemorySwap": 268435456,
            "MemorySwappiness": null,
            "OomKillDisable": null,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/acpi",
                "/proc/asound",
                "/proc/interrupts",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/sys/devices/virtual/powercap",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "Storage": {
            "RootFS": {
                "Snapshot": {
                    "Name": "overlayfs"
                }
            }
        },
        "Mounts": [
            {
                "Type": "volume",
                "Name": "ns_erp_dev_traefik-certificates",
                "Source": "/var/lib/docker/volumes/ns_erp_dev_traefik-certificates/_data",
                "Destination": "/letsencrypt",
                "Driver": "local",
                "Mode": "rw",
                "RW": true,
                "Propagation": ""
            },
            {
                "Type": "bind",
                "Source": "/var/run/docker.sock",
                "Destination": "/var/run/docker.sock",
                "Mode": "ro",
                "RW": false,
                "Propagation": "rprivate"
            }
        ],
        "Config": {
            "Hostname": "a6b4130a26c4",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": true,
            "AttachStderr": true,
            "ExposedPorts": {
                "443/tcp": {},
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "--api.insecure=false",
                "--providers.docker=true",
                "--providers.docker.exposedbydefault=false",
                "--providers.docker.network=traefik-public",
                "--entrypoints.web.address=:80",
                "--entrypoints.websecure.address=:443",
                "--entrypoints.web.http.redirections.entryPoint.to=websecure",
                "--entrypoints.web.http.redirections.entryPoint.scheme=https",
                "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web",
                "--certificatesresolvers.myresolver.acme.email=devadminnserp@nsengineering.com.np",
                "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
            ],
            "Image": "traefik:v3.6",
            "Volumes": null,
            "WorkingDir": "/",
            "Entrypoint": [
                "/entrypoint.sh"
            ],
            "Labels": {
                "com.docker.compose.config-hash": "c51d884585a6fdd7b584c7d1a68edeaf9e059a5e51a6bc28a9ba0a217baf29ef",
                "com.docker.compose.container-number": "1",
                "com.docker.compose.depends_on": "",
                "com.docker.compose.image": "sha256:802adc80a7bb20a6766c9385c2ad547f0de98564cd20d31d0b6d8f726f906f66",
                "com.docker.compose.oneoff": "False",
                "com.docker.compose.project": "ns_erp_dev",
                "com.docker.compose.project.config_files": "/opt/ns-erp/docker/docker-compose.yml",
                "com.docker.compose.project.working_dir": "/opt/ns-erp/docker",
                "com.docker.compose.service": "traefik",
                "com.docker.compose.version": "5.1.3",
                "org.opencontainers.image.description": "A modern reverse-proxy",
                "org.opencontainers.image.documentation": "https://docs.traefik.io",
                "org.opencontainers.image.source": "https://github.com/traefik/traefik",
                "org.opencontainers.image.title": "Traefik",
                "org.opencontainers.image.url": "https://traefik.io",
                "org.opencontainers.image.vendor": "Traefik Labs",
                "org.opencontainers.image.version": "v3.6.17"
            }
        },
        "NetworkSettings": {
            "SandboxID": "fb8c1610e564444059158155c9a8f24c6e0232c5197e1f3dc444c16e15d239f2",
            "SandboxKey": "/var/run/docker/netns/fb8c1610e564",
            "Ports": {
                "443/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "443"
                    },
                    {
                        "HostIp": "::",
                        "HostPort": "443"
                    }
                ],
                "80/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "80"
                    },
                    {
                        "HostIp": "::",
                        "HostPort": "80"
                    }
                ]
            },
            "Networks": {
                "traefik-public": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": [
                        "ns_erp_dev_traefik",
                        "traefik"
                    ],
                    "DriverOpts": null,
                    "GwPriority": 0,
                    "NetworkID": "f839529273f7459c8abc0f7d54cf0c65eca4d1d8ab59dfd4044f5c5a477044af",
                    "EndpointID": "6a3fbea97ba7390134c20bd0d250e81864f26f940e447457274abb1dd9a69eaa",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "MacAddress": "72:36:35:66:5e:77",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DNSNames": [
                        "ns_erp_dev_traefik",
                        "traefik",
                        "a6b4130a26c4"
                    ]
                }
            }
        },
        "ImageManifestDescriptor": {
            "mediaType": "application/vnd.oci.image.manifest.v1+json",
            "digest": "sha256:18d36de0b283a62956cd290fef284a474aa1242f18c005a856a8ef5d8f5fc93b",
            "size": 1729,
            "annotations": {
                "com.docker.official-images.bashbrew.arch": "amd64",
                "org.opencontainers.image.base.digest": "sha256:4d889c14e7d5a73929ab00be2ef8ff22437e7cbc545931e52554a7b00e123d8b",
                "org.opencontainers.image.base.name": "alpine:3.23",
                "org.opencontainers.image.created": "2026-05-11T21:38:22Z",
                "org.opencontainers.image.revision": "dda5c39d72ed12e911c3131e22d1734becc120d4",
                "org.opencontainers.image.source": "https://github.com/traefik/traefik-library-image.git#dda5c39d72ed12e911c3131e22d1734becc120d4:v3.6/alpine",
                "org.opencontainers.image.url": "https://hub.docker.com/_/traefik",
                "org.opencontainers.image.version": "v3.6.17"
            },
            "platform": {
                "architecture": "amd64",
                "os": "linux"
            }
        }
    }
]
