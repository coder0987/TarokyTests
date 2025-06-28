import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import * as k8s from "@kubernetes/client-node";

const roomId = "room-test123";
const namespace = "taroky-namespace"; // Change this if needed

// Types for Kubernetes resources
interface K8sResource {
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface K8sError extends Error {
  response?: {
    statusCode: number;
  };
  body?: {
    message?: string;
  };
}

function buildRoomResources(roomId: string): K8sResource[] {
  const rawYaml = fs.readFileSync(
    path.join(__dirname, "room-template.yaml"),
    "utf8"
  );
  const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
  return yaml.loadAll(filledYaml) as K8sResource[];
}

async function deleteIfExists(
  kind: string,
  name: string,
  appsApi: k8s.AppsV1Api,
  coreApi: k8s.CoreV1Api
): Promise<void> {
  try {
    if (kind === "Deployment") {
      await appsApi.deleteNamespacedDeployment(name, namespace);
      console.log(`[cleanup] Deleted existing Deployment: ${name}`);
    } else if (kind === "Service") {
      await coreApi.deleteNamespacedService(name, namespace);
      console.log(`[cleanup] Deleted existing Service: ${name}`);
    }
  } catch (err) {
    const k8sErr = err as K8sError;
    if (k8sErr.response && k8sErr.response.statusCode === 404) {
      console.log(`[cleanup] ${kind} ${name} not found.`);
    } else {
      console.warn(
        `[cleanup] Error deleting ${kind} ${name}:`,
        k8sErr.body?.message || k8sErr.message
      );
    }
  }
}

async function dryRunApply(
  resources: K8sResource[],
  appsApi: k8s.AppsV1Api,
  coreApi: k8s.CoreV1Api
): Promise<void> {
  for (const resource of resources) {
    const name = resource.metadata.name;
    const kind = resource.kind;

    try {
      if (kind === "Deployment") {
        await appsApi.createNamespacedDeployment(
          namespace,
          resource as k8s.V1Deployment,
          undefined, // pretty
          undefined, // dryRun - note: the original code had this wrong
          undefined, // fieldManager
          undefined, // fieldValidation
          ["All"] as any // dryRun parameter - should be string array
        );
        console.log(`[dry-run] Deployment ${name}: OK`);
      } else if (kind === "Service") {
        await coreApi.createNamespacedService(
          namespace,
          resource as k8s.V1Service,
          undefined, // pretty
          undefined, // dryRun
          undefined, // fieldManager
          undefined, // fieldValidation
          ["All"] as any // dryRun parameter
        );
        console.log(`[dry-run] Service ${name}: OK`);
      } else {
        console.warn(`[dry-run] Unsupported kind: ${kind}`);
      }
    } catch (err) {
      const k8sErr = err as K8sError;
      console.error(
        `[dry-run] Error applying ${kind} ${name}:`,
        k8sErr.body?.message || k8sErr.message
      );
    }
  }
}

async function main(): Promise<void> {
  const isCleanup = process.argv.includes("--cleanup");

  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const appsApi = kc.makeApiClient(k8s.AppsV1Api);
  const coreApi = kc.makeApiClient(k8s.CoreV1Api);

  try {
    const resources = buildRoomResources(roomId);

    for (const resource of resources) {
      const kind = resource.kind;
      const name = resource.metadata.name;

      if (isCleanup) {
        await deleteIfExists(kind, name, appsApi, coreApi);
      } else {
        await deleteIfExists(kind, name, appsApi, coreApi); // clean before dry-run
      }
    }

    if (!isCleanup) {
      await dryRunApply(resources, appsApi, coreApi);
    }
  } catch (error) {
    console.error("[main] Unexpected error:", error);
    process.exit(1);
  }
}

// Execute the main function
main().catch((error) => {
  console.error("[main] Fatal error:", error);
  process.exit(1);
});
