import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

//decimate shoes,
//fix mouse pointer on hover
// reduce floor tex,
//extreme low poly for raycast

let camera, scene, renderer, hoveredShoe, controls, canvas;
let asicsShoe,
  columbiaShoe,
  gucciShoe,
  newBalanceShoe,
  nikeZoomShoe,
  sieviRacerShoe,
  vansShoe;
const raycaster = new THREE.Raycaster();
const cursor = { x: 0, y: 0 };

init();
render();
const gui = new GUI();
gui.close();

const defaultParams = {
  asicsXpos: 0,
  asicsYpos: 0,
  asicsZpos: 0,
  asicsXrot: 0,
  asicsYrot: 0,
  asicsZrot: 0,

  columbiaXpos: 0,
  columbiaYpos: 0,
  columbiaZpos: 0,
  columbiaXrot: 0,
  columbiaYrot: 0,
  columbiaZrot: 0,
  columbiaScale: 1,

  gucciXpos: 0,
  gucciYpos: 0,
  gucciZpos: 0,
  gucciXrot: 0,
  gucciYrot: 0,
  gucciZrot: 0,
  gucciScale: 1,

  newBalanceXpos: 0,
  newBalanceYpos: 0,
  newBalanceZpos: 0,
  newBalanceXrot: 0,
  newBalanceYrot: 0,
  newBalanceZrot: 0,
  newBalanceScale: 1,

  nikeZoomXpos: 0,
  nikeZoomYpos: 0,
  nikeZoomZpos: 0,
  nikeZoomXrot: 0,
  nikeZoomYrot: 0,
  nikeZoomZrot: 0,

  sieviXpos: 0,
  sieviYpos: 0,
  sieviZpos: 0,
  sieviXrot: 0,
  sieviYrot: 0,
  sieviZrot: 0,

  vansXpos: 0,
  vansYpos: 0,
  vansZpos: 0,
  vansXrot: 0,
  vansYrot: 0,
  vansZrot: 0,
};

function init() {
  //   const container = document.createElement("div");
  //   document.body.appendChild(container);
  canvas = document.querySelector("canvas.webgl");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(-1.8, 1.6, 3.7);

  scene = new THREE.Scene();

  new RGBELoader().setPath("/").load("autoshop.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;

    // render();
  });
  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight();
  const directionalLight = new THREE.DirectionalLight();
  scene.add(ambientLight, directionalLight);

  //floor platform for shoes
  const textureLoader = new THREE.TextureLoader();
  const floorDiffuse = textureLoader.load(
    "/tex/Wood062_1K-JPG/Wood062_1K_Color.jpg"
  );

  const floorTable = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 0.1, 64),
    new THREE.MeshStandardMaterial({
      roughness: 0.2,
      map: floorDiffuse,
      color: 0x221100,
    })
  );
  scene.add(floorTable);

  /**
   * box click listeners

  //Asics box
  const asicsListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(asicsListenerBox);
  //Columbia box
  const columbiaListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xffff00 })
  );
  scene.add(columbiaListenerBox);
  //Gucci box
  const gucciListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00 })
  );
  scene.add(gucciListenerBox);
  //New Balance box
  const newBalanceListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ffff })
  );
  scene.add(newBalanceListenerBox);
  //Nike Zoom box
  const nikeZoomListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x0000ff })
  );
  scene.add(nikeZoomListenerBox);
  //Sievi Racer box
  const sieviListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff00ff })
  );
  scene.add(sieviListenerBox);
  //Vans box
  const vansListenerBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.6, 1.2),
    new MeshBasicMaterial({ color: 0xffffff })
  );
  vansListenerBox.position.set(0, -1.1, 0.1);
  scene.add(vansListenerBox);   */
  /**
   * LOAD SHOES
   */
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  // asics
  const asics = new THREE.Object3D();
  asicsShoe = asics;
  const loader = new GLTFLoader().setPath("models/asics_shoe/");
  loader.setDRACOLoader(dracoLoader);
  loader.load("asics.gltf", function (gltf) {
    const halfDistance = 0.23;
    const rightLeg = gltf.scene;
    rightLeg.scale.set(4.8, 4.8, 4.8);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(-4.8, 4.8, 4.8);
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;

    asics.add(leftLeg, rightLeg);
    scene.add(asics);
    asics.position.set(1.335, 0.336, -0.225);
    asics.rotation.y = 1.704;
    const folder = gui.addFolder("Asics");
    folder.add(defaultParams, "asicsXpos", -2.0, 2.0).onChange((val) => {
      asics.position.x = val;

      // render();
    });
    // folder.add(defaultParams, "asicsYpos", -2.0, 2.0).onChange((val) => {
    //   asics.position.y = val;
    //   render();
    // });
    folder.add(defaultParams, "asicsZpos", -2.0, 2.0).onChange((val) => {
      asics.position.z = val;
      // render();
    });

    folder.add(defaultParams, "asicsYrot", -4, 4).onChange((val) => {
      asics.rotation.y = val;
      // render();
    });
    gui.close();
    // render();
  });
  // columbia
  const columbia = new THREE.Object3D();
  columbiaShoe = columbia;
  loader.setPath("models/columbia_bajada_iii/");
  loader.load("columbia.gltf", function (gltf) {
    const halfDistance = 0.23;
    const rightLeg = gltf.scene;
    rightLeg.scale.set((7 * 0.96) / 1000, (7 * 0.96) / 1000, (7 * 0.96) / 1000);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set((-7 * 0.96) / 1000, (7 * 0.96) / 1000, (7 * 0.96) / 1000);
    leftLeg.position.x = -halfDistance;
    leftLeg.rotateY(-1.57 / 2);
    rightLeg.rotateY(1.57 / 2);
    rightLeg.position.x = halfDistance;

    columbia.add(leftLeg, rightLeg);
    columbia.position.set(-0.387, 0.524, -1.374);
    columbia.rotation.y = -2.89;
    scene.add(columbia);

    const folder = gui.addFolder("Columbia");
    folder.add(defaultParams, "columbiaXpos", -2.0, 2.0).onChange((val) => {
      columbia.position.x = val;

      // render();
    });
    folder.add(defaultParams, "columbiaYpos", -2.0, 2.0).onChange((val) => {
      columbia.position.y = val;
      // render();
    });
    folder.add(defaultParams, "columbiaZpos", -2.0, 2.0).onChange((val) => {
      columbia.position.z = val;
      // render();
    });

    folder.add(defaultParams, "columbiaYrot", -4, 4).onChange((val) => {
      columbia.rotation.y = val;
      // render();
    });
    folder.add(defaultParams, "columbiaScale", 0, 1).onChange((val) => {
      columbia.scale.setScalar(val);
      // render();
    });
    gui.close();

    // render();
  });

  // gucci
  const gucci = new THREE.Object3D();
  gucciShoe = gucci;
  loader.setPath("models/gucci_shoes/");
  loader.load("gucci.gltf", function (gltf) {
    const halfDistance = -0.09;
    const rightLeg = gltf.scene;
    rightLeg.scale.set(
      (4.8 * 0.822) / 17,
      (4.8 * 0.822) / 17,
      (4.8 * 0.822) / 17
    );
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(
      (-4.8 * 0.822) / 17,
      (4.8 * 0.822) / 17,
      (4.8 * 0.822) / 17
    );
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;
    leftLeg.rotateY(1.57);
    rightLeg.rotateY(-1.57);

    gucci.add(leftLeg, rightLeg);
    gucci.position.set(-1.086, 0.3186, -0.306);
    gucci.rotation.y = -1.912;
    scene.add(gucci);

    const folder = gui.addFolder("Gucci");
    folder.add(defaultParams, "gucciXpos", -2.0, 2.0).onChange((val) => {
      gucci.position.x = val;
      // render();
    });
    // folder.add(defaultParams, "gucciYpos", -2.0, 2.0).onChange((val) => {
    //   gucci.position.y = val;
    //   render();
    // });
    folder.add(defaultParams, "gucciZpos", -2.0, 2.0).onChange((val) => {
      gucci.position.z = val;
      // render();
    });

    folder.add(defaultParams, "gucciYrot", -4, 4).onChange((val) => {
      gucci.rotation.y = val;
      // render();
    });

    folder.add(defaultParams, "gucciScale", 0, 1).onChange((val) => {
      gucci.scale.setScalar(val);
      // render();
    });
    gui.close();

    // render();
  });

  // newBalance
  const newBalance = new THREE.Object3D();
  newBalanceShoe = newBalance;
  loader.setPath("models/new-balance-fresh-foam-roav/");
  loader.load("newBalance.gltf", function (gltf) {
    const halfDistance = 0.23;
    const rightLeg = gltf.scene;
    rightLeg.scale.set(4.6 * 0.85, 4.6 * 0.85, 4.6 * 0.85);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(-4.6 * 0.85, 4.6 * 0.85, 4.6 * 0.85);
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;

    newBalance.add(leftLeg, rightLeg);
    newBalance.position.set(-1.044, 0.34, 0.924);
    newBalance.rotation.y = -0.816;
    scene.add(newBalance);

    const folder = gui.addFolder("New Balance");
    folder.add(defaultParams, "newBalanceXpos", -2.0, 2.0).onChange((val) => {
      newBalance.position.x = val;
      // render();
    });
    folder.add(defaultParams, "newBalanceYpos", -2.0, 2.0).onChange((val) => {
      newBalance.position.y = val;
      // render();
    });
    folder.add(defaultParams, "newBalanceZpos", -2.0, 2.0).onChange((val) => {
      newBalance.position.z = val;
      // render();
    });

    folder.add(defaultParams, "newBalanceYrot", -4, 4).onChange((val) => {
      newBalance.rotation.y = val;
      // render();
    });
    folder.add(defaultParams, "newBalanceScale", 0, 1).onChange((val) => {
      newBalance.scale.setScalar(val);
      // render();
    });
    gui.close();
    // render();
  });

  // nikeZoom
  const nikeZoom = new THREE.Object3D();
  nikeZoomShoe = nikeZoom;
  loader.setPath("models/nike_zoom_pegasus_shoe_by_digitworlds.com_-/");
  loader.load("scene.gltf", function (gltf) {
    const halfDistance = 1.67;
    const rightLeg = gltf.scene; //.children[0].children[0];
    rightLeg.scale.set(12 / 100, 12 / 100, 12 / 100);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(-12 / 100, 12 / 100, 12 / 100);
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;
    rightLeg.rotateY(1.57);
    leftLeg.rotateY(-1.57);

    nikeZoom.add(leftLeg, rightLeg);
    nikeZoom.position.set(0.063, 0.214, 1.6);
    nikeZoom.rotation.y = 0;
    scene.add(nikeZoom);

    const folder = gui.addFolder("Nike Zoom");
    folder.add(defaultParams, "nikeZoomXpos", -2.0, 2.0).onChange((val) => {
      nikeZoom.position.x = val;
      // render();
    });
    // folder.add(defaultParams, "nikeZoomYpos", -2.0, 2.0).onChange((val) => {
    //   nikeZoom.position.y = val;
    //   render();
    // });
    folder.add(defaultParams, "nikeZoomZpos", -2.0, 2.0).onChange((val) => {
      nikeZoom.position.z = val;
      // render();
    });

    folder.add(defaultParams, "nikeZoomYrot", -4, 4).onChange((val) => {
      nikeZoom.rotation.y = val;
      // render();
    });
    gui.close();
    // render();
  });

  // sieviRacer
  const sieviRacer = new THREE.Object3D();
  sieviRacerShoe = sieviRacer;
  loader.setPath("models/sievi_racer_safety_shoe/");
  loader.load("sieviRacer.gltf", function (gltf) {
    const halfDistance = 0.23;
    const rightLeg = gltf.scene;
    rightLeg.scale.set(18 / 100, 18 / 100, 18 / 100);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(-18 / 100, 18 / 100, 18 / 100);
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;

    sieviRacer.add(leftLeg, rightLeg);
    sieviRacer.position.set(0.639, 0.016, -1.086);
    sieviRacer.rotation.y = 2.688;
    scene.add(sieviRacer);

    const folder = gui.addFolder("Sievi Racer");
    folder.add(defaultParams, "sieviXpos", -2.0, 2.0).onChange((val) => {
      sieviRacer.position.x = val;
      // render();
    });
    // folder.add(defaultParams, "sieviYpos", -2.0, 2.0).onChange((val) => {
    //   sieviRacer.position.y = val;
    //   render();
    // });
    folder.add(defaultParams, "sieviZpos", -2.0, 2.0).onChange((val) => {
      sieviRacer.position.z = val;
      // render();
    });

    folder.add(defaultParams, "sieviYrot", -4, 4).onChange((val) => {
      sieviRacer.rotation.y = val;
      // render();
    });
    gui.close();
    // render();
  });

  // Vans
  const vans = new THREE.Object3D();
  vansShoe = vans;
  loader.setPath("models/vans_shoe/");
  loader.load("scene.gltf", function (gltf) {
    const halfDistance = 2.86;
    const rightLeg = gltf.scene;
    rightLeg.scale.set(5 / 1000, 5 / 1000, 5 / 1000);
    const leftLeg = rightLeg.clone();
    leftLeg.scale.set(-5 / 1000, 5 / 1000, 5 / 1000);
    leftLeg.position.x = halfDistance;
    rightLeg.position.x = -halfDistance;
    rightLeg.rotateY(-1.57);
    leftLeg.rotateY(1.57);

    vans.add(leftLeg, rightLeg);
    vans.position.set(1.089, 1.46, 0.885);
    vans.rotation.y = 1.048;
    scene.add(vans);

    const folder = gui.addFolder("Vans");
    folder.add(defaultParams, "vansXpos", -2.0, 2.0).onChange((val) => {
      vans.position.x = val;
      // render();
    });
    // folder.add(defaultParams, "vansYpos", 0, 2).onChange((val) => {
    //   vans.position.y = val;
    //   render();
    // });
    folder.add(defaultParams, "vansZpos", -2.0, 2.0).onChange((val) => {
      vans.position.z = val;
      // render();
    });

    folder.add(defaultParams, "vansYrot", -4, 4).onChange((val) => {
      vans.rotation.y = val;
      // render();
    });
    gui.close();
    // render();
  });

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  //   renderer = new THREE.WebGLRenderer({});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  //   container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  // gui.update();
  // render();
}

//

function render() {
  renderer.render(scene, camera);
}
let isIntersecting = false;
let clickedShoe = "";
function tick() {
  window.requestAnimationFrame(tick);
  render();
  if (controls) controls.update();
  raycaster.setFromCamera(cursor, camera);

  isIntersecting = false;
  if (asicsShoe) {
    const asicsTest = raycaster.intersectObject(asicsShoe, true);
    if (asicsTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "asics";
    }
  }
  if (columbiaShoe) {
    const columbiaTest = raycaster.intersectObject(columbiaShoe, true);
    if (columbiaTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "columbia";
    }
  }
  if (gucciShoe) {
    const gucciTest = raycaster.intersectObject(gucciShoe, true);
    if (gucciTest.length > 0)
      if (gucciTest[0].point.y > 0.05) {
        isIntersecting = true;
        clickedShoe = "gucci";
      }
  }
  if (newBalanceShoe) {
    const newBalanceTest = raycaster.intersectObject(newBalanceShoe, true);
    if (newBalanceTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "newBalance";
    }
  }
  if (nikeZoomShoe) {
    const nikeZoomTest = raycaster.intersectObject(nikeZoomShoe, true);
    if (nikeZoomTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "nikeZoom";
    }
  }
  if (sieviRacerShoe) {
    const sieviRacerTest = raycaster.intersectObject(sieviRacerShoe, true);
    if (sieviRacerTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "sieviRacer";
    }
  }
  if (vansShoe) {
    const vansTest = raycaster.intersectObject(vansShoe, true);
    if (vansTest.length > 0) {
      isIntersecting = true;
      clickedShoe = "vans";
    }
  }
  if (isIntersecting) canvas.style.cursor = "pointer";
  else {
    canvas.style.cursor = "auto";
    clickedShoe = "";
  }
}

tick();
//convert to pointerdown/pointerup to remove drag clicks
let isMouseDOwn = false,
  isDragging = false,
  isMoving = false;

window.addEventListener("pointerdown", () => {
  isMouseDOwn = true;
});
window.addEventListener("pointermove", (e) => {
  cursor.x = 2 * (e.clientX / window.innerWidth) - 1;
  cursor.y = -2 * (e.clientY / window.innerHeight) + 1;

  if (isMouseDOwn) isDragging = true;
});

window.addEventListener("pointerup", () => {
  if (!isDragging) {
    //then perform click

    switch (clickedShoe) {
      case "":
        break;
      case "asics":
        window.open(
          "https://www.amazon.com/ASICS-Womens-Gel-Venture-Running-Black/dp/B091KGFSRL/ref=sr_1_1?crid=76EV940O3ERW&keywords=asics%2Bgel%2Bventure%2B8%2Bwomen&qid=1659010379&sprefix=asics%2Bgel%2Bventure%2B8%2Caps%2C784&sr=8-1&th=1",
          "_blank"
        );
        break;

      case "columbia":
        window.open(
          "https://www.amazon.com/Columbia-Montrail-Womens-Sneaker-Regular/dp/B07JL4NSS6/ref=sr_1_3?crid=1J645HNW4APKF&keywords=columbia+montrail+bajada&qid=1659015757&sprefix=columbia+montrail+b%2Caps%2C294&sr=8-3",
          "_blank"
        );
        break;

      case "gucci":
        window.open(
          "https://www.gucci.com/us/en/pr/women/shoes-for-women/sneakers-for-women/womens-ace-embroidered-platform-sneaker-p-577573DOPE09064",
          "_blank"
        );
        break;

      case "newBalance":
        window.open(
          "https://www.amazon.com/New-Balance-Fresh-Running-Aluminum/dp/B093QJH239/ref=sr_1_7?keywords=new%2Bbalance%2Bshoes&qid=1659009217&sr=8-7&th=1",
          "_blank"
        );
        break;

      case "nikeZoom":
        window.open(
          "https://www.amazon.in/NIKE-Pegasus-Running-Sport-Shoes/dp/B07C1PJM3B",
          "_blank"
        );
        break;

      case "sieviRacer":
        window.open(
          "https://www.sievi.com/products/safety-shoes/sievi-racer-roller-s3",
          "_blank"
        );
        break;

      case "vans":
        window.open(
          "https://www.amazon.com/Vans-Unisex-Sk8-Hi-Black-White/dp/B001C0LIVC/ref=sr_1_37?keywords=Vans+Shoes&qid=1659008629&sr=8-37",
          "_blank"
        );
        break;

      default:
        break;
    }
  }

  isDragging = false;
  isMouseDOwn = false;
});
window.addEventListener("click", () => {});
