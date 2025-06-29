import * as k8s from "@kubernetes/client-node";
import fs from "fs";
import * as yaml from "js-yaml";
import path from "path";

class Kube {
    #kc;
    #k8sApiApps;
    #k8sApiCore;
    public static NAMESPACE = "taroky-namespace";

    constructor() {
        this.#kc = new k8s.KubeConfig();
        this.#kc.loadFromDefault();
        this.#k8sApiApps = this.#kc.makeApiClient(k8s.AppsV1Api);
        this.#k8sApiCore = this.#kc.makeApiClient(k8s.CoreV1Api);
    }

    async deployRoomToK8s(roomId: string): Promise<void> {
        const resources = buildRoomResources(roomId);
        for (const resource of resources) {
            if (resource.kind === "Deployment") {
            await this.#k8sApiApps.createNamespacedDeployment(Kube.NAMESPACE, resource);
            } else if (resource.kind === "Service") {
            await this.#k8sApiCore.createNamespacedService(Kube.NAMESPACE, resource);
            }
        }
    }

    async deleteRoom(roomId: string) {
        await this.#k8sApiApps.deleteNamespacedDeployment(roomId, Kube.NAMESPACE);
        await this.#k8sApiCore.deleteNamespacedService(roomId, Kube.NAMESPACE);
    }

    // throws an error if not found
    async getRoom(roomId: string) {
        return await this.#k8sApiApps.readNamespacedDeployment(roomId, Kube.NAMESPACE);
    }
}

function buildRoomResources(roomId: string): any[] {
  const rawYaml = fs.readFileSync(
    path.join(__dirname, "room-template.yaml"),
    "utf8"
  );
  const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
  return yaml.loadAll(filledYaml) as any[];
}

module.exports = Kube;