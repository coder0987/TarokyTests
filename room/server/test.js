const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const k8s = require('@kubernetes/client-node');

const roomId = 'room-test123';
const namespace = 'taroky-namespace'; // Change this if needed

function buildRoomResources(roomId) {
  const rawYaml = fs.readFileSync(path.join(__dirname, 'room-template.yaml'), 'utf8');
  const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
  return yaml.loadAll(filledYaml);
}

async function deleteIfExists(kind, name, appsApi, coreApi) {
  try {
    if (kind === 'Deployment') {
      await appsApi.deleteNamespacedDeployment(name, namespace);
      console.log(`[cleanup] Deleted existing Deployment: ${name}`);
    } else if (kind === 'Service') {
      await coreApi.deleteNamespacedService(name, namespace);
      console.log(`[cleanup] Deleted existing Service: ${name}`);
    }
  } catch (err) {
    if (err.response && err.response.statusCode === 404) {
      console.log(`[cleanup] ${kind} ${name} not found.`);
    } else {
      console.warn(`[cleanup] Error deleting ${kind} ${name}:`, err.body?.message || err.message);
    }
  }
}

async function dryRunApply(resources, appsApi, coreApi) {
  for (const resource of resources) {
    const name = resource.metadata.name;
    const kind = resource.kind;

    try {
      if (kind === 'Deployment') {
        await appsApi.createNamespacedDeployment(
          namespace,
          resource,
          undefined,
          undefined,
          ['All'] // dry-run
        );
        console.log(`[dry-run] Deployment ${name}: OK`);
      } else if (kind === 'Service') {
        await coreApi.createNamespacedService(
          namespace,
          resource,
          undefined,
          undefined,
          ['All']
        );
        console.log(`[dry-run] Service ${name}: OK`);
      } else {
        console.warn(`[dry-run] Unsupported kind: ${kind}`);
      }
    } catch (err) {
      console.error(`[dry-run] Error applying ${kind} ${name}:`, err.body?.message || err.message);
    }
  }
}

(async () => {
  const isCleanup = process.argv.includes('--cleanup');

  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const appsApi = kc.makeApiClient(k8s.AppsV1Api);
  const coreApi = kc.makeApiClient(k8s.CoreV1Api);

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
})();
