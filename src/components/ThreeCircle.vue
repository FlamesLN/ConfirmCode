<template>
  <div class="d-rotate">
    <div id="three"></div>
  </div>
</template>
<script>
import * as THREE from "three";
export default {
  components: {},
  data() {
    return {
      renderer: null,
      composer: null,
      afterimagePass: null,
      controls: null,
      scene: null,
      camera: null,
      particles: null,
      blazes: [],
      light: [],
      cameraRotatingAngle: 0,
    };
  },
  created() {},
  mounted() {
    this.setup();
    this.animate();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    setup() {
      //TEST
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      document.getElementById("three").appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        500
      );
      this.camera.position.set(20, 10, 0);
      this.camera.lookAt(0, 0, 0);
      this.scene = new THREE.Scene();

      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

      this.afterimagePass = new THREE.AfterimagePass();
      this.composer.addPass(this.afterimagePass);

      this.afterimagePass.uniforms["damp"].value = 0.98;

      this.renderer.render(this.scene, this.camera);

      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

      this.controls.update();

      this.light.push(new THREE.PointLight(0xff0000, 5, 300));
      this.light[0].position.set(5, 1, 0);
      this.light[0].castShadow = true;
      this.scene.add(this.light[0]);

      this.light.push(new THREE.PointLight(0xff0000, 5, 300));
      this.light[1].position.set(0, 1, 5);
      this.light[1].castShadow = true;
      this.scene.add(this.light[1]);

      this.light.push(new THREE.PointLight(0xff0000, 5, 300));
      this.light[2].position.set(-5, 1, 0);
      this.light[2].castShadow = true;
      this.scene.add(this.light[2]);

      this.light.push(new THREE.PointLight(0xff0000, 5, 300));
      this.light[3].position.set(0, 1, -5);
      this.light[3].castShadow = true;
      this.scene.add(this.light[3]);

      this.light.push(new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3));
      this.scene.add(this.light[4]);

      // var size = 100;
      // var divisions = 100;

      // var gridHelper = new THREE.GridHelper(size, divisions);
      // //this.scene.add(gridHelper);

      // let axesHelper = new THREE.AxesHelper(5);
      // //this.scene.add(axesHelper);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, 0);
      //this.scene.add(cube);
      console.log(this.scene);
      let blazeMaterial = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false,
        //transparent: true,
        vertexColors: true,
        vertexShader: `
        attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            vec3 whiteColor = vec3(1,1,1);
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = 0.5 - length(xy)/0.5;
            vec3 mixColor = mix(vColor, whiteColor,ll);
            //gl_FragColor = vec4(vColor, smoothstep(0.0,1.0,ll));
            gl_FragColor = vec4(mixColor, smoothstep(0.0,0.5,ll));
          }
        `,
      });
      let positions = [];
      let colors = [];
      let sizes = [];
      this.particles = new THREE.BufferGeometry();
      for (let y = 0; y < 2000; y++) {
        let ballSize = 20;
        let direction = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
        let newPos = new THREE.Vector3(0, 0, 0);
        newPos = direction.multiplyScalar(ballSize);
        let blaze = {
          size: 2,
          ballSize: ballSize,
          color: new THREE.Color(
            "rgb(" +
              Math.floor(Math.random() * 50 + 100) +
              "," +
              Math.floor(Math.random() * 50 + 100) +
              "," +
              Math.floor(Math.random() * 50 + 100) +
              ")"
          ),
          coords: {
            dir: direction,
            x: newPos.x,
            y: newPos.y,
            z: newPos.z,
          },
          eternalDir: new THREE.Vector3(
            (Math.random() * 2 - 1) / 800,
            (Math.random() * 2 - 1) / 800,
            (Math.random() * 2 - 1) / 800
          ),
        };
        colors.push(blaze.color.r, blaze.color.g, blaze.color.b);
        sizes.push(blaze.size);
        positions.push(blaze.coords.x);
        positions.push(blaze.coords.y);
        positions.push(blaze.coords.z);

        this.blazes.push(blaze);
      }
      //console.log(positions,sizes, colors,"here are positions")
      this.particles.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      this.particles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      this.particles.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
      console.log("here we are", this.blazes);
      var particleSystem = new THREE.Points(this.particles, blazeMaterial);
      this.scene.add(particleSystem);
      particleSystem.sortParticles = true;
    },
    onResize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.camera.position.x = 60 * Math.cos(this.cameraRotatingAngle * (Math.PI / 180));
      this.camera.position.z = 60 * Math.sin(this.cameraRotatingAngle * (Math.PI / 180));
      this.camera.lookAt(0, 0, 0);

      var positions = this.particles.attributes.position.array;
      // var sizes = this.particles.attributes.size.array;

      for (let y = 0; y < positions.length; y++) {
        if (y % 3 === 0) {
          let newPos = this.blazes[y / 3].coords.dir;
          newPos.applyAxisAngle(
            new THREE.Vector3(1, 0, 0),
            this.blazes[y / 3].eternalDir.x
          );
          newPos.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            this.blazes[y / 3].eternalDir.y
          );
          newPos.applyAxisAngle(
            new THREE.Vector3(0, 0, 1),
            this.blazes[y / 3].eternalDir.z
          );
          newPos = newPos.normalize().multiplyScalar(this.blazes[y / 3].ballSize);
          positions[y] = newPos.x;
          positions[y + 1] = newPos.y;
          positions[y + 2] = newPos.z;
        }
      }
      this.particles.attributes.position.needsUpdate = true;
      this.particles.attributes.size.needsUpdate = true;

      this.cameraRotatingAngle += 0.2;
      //this.renderer.render(this.scene, this.camera);
      this.composer.render();
    },
  },
};
</script>

<style scoped>
.d-rotate {
  overflow: hidden;
  background: rgba(30, 30, 30, 1);
}
</style>
