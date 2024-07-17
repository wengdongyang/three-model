/** @format */
import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  RenderPass,
  EffectComposer,
  BlendFunction,
  EdgeDetectionMode,
  EffectPass,
  OutlineEffect,
  SMAAEffect,
  SMAAImageLoader,
  SMAAPreset,
} from 'postprocessing';

export default class Viewer {
  static container; // 容器
  static modelUrl; // 模型的地址
  static modelBgPath; // 模型的背景图

  static tagDatas = []; // 标签数据

  static scene; // 场景
  static clock; // 时间线
  static mouse; // 鼠标
  static camera; // 摄像机
  static controls; // 轨道控制器
  static raycaster; // 射线

  static renderer; // 渲染器
  static css3DRender; // 3D渲染器

  static isInitialized = false; // 是否初始化完成

  static selectableObjects = []; // 可被选中的object
  static selectedObjects = []; // 已经被选过的object new THREE.Mesh()

  static intervalRef; // 定时器

  static tagObjects = []; // 标签组-2D
  static tagBoxObjects = []; // 标签组-3D方块

  constructor({ container, modelUrl, modelBgPath = '', tagDatas = [] }) {
    this.container = container;
    this.modelUrl = modelUrl;
    this.modelBgPath = modelBgPath;
    this.tagDatas = tagDatas || [];

    this.initViewerBase();
  }

  initViewerBase = () => {
    const { container, modelBgPath } = this;
    try {
      const { clientWidth, clientHeight } = container;
      // 初始化场景
      const scene = new THREE.Scene();
      // 初始化时钟
      const clock = new THREE.Clock();
      // 初始化背景
      if (modelBgPath) {
        const reflectionCube = new THREE.CubeTextureLoader()
          .setPath(modelBgPath)
          .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
        scene.background = reflectionCube;
      }
      // 初始化摄像机
      const camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
      camera.position.set(5, 5, 5);
      // 灯光
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      hemiLight.position.set(100, 100, 0);
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      const dirLight = new THREE.DirectionalLight(0xffffff, 3);
      dirLight.position.set(100, 100, 100);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = clientWidth;
      dirLight.shadow.mapSize.height = clientHeight;
      const dirLightfill = new THREE.DirectionalLight(0xffffff, 2.5);
      dirLightfill.position.set(-100, 150, -100);
      // 初始化辅助线
      const axes = new THREE.AxesHelper(50);
      // 初始化鼠标
      const mouse = new THREE.Vector2();
      // 初始化射线
      const raycaster = new THREE.Raycaster();

      // 主renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(clientWidth, clientHeight);
      // 3DRender
      const css3DRender = new CSS3DRenderer();
      css3DRender.setSize(clientWidth, clientHeight);
      css3DRender.domElement.style.position = 'absolute';
      css3DRender.domElement.style.top = 0;
      css3DRender.domElement.style.zIndex = 1;
      // 初始化轨道控制器
      const controls = new OrbitControls(camera, css3DRender.domElement);
      controls.enableDamping = true;

      this.scene = scene;
      this.clock = clock;
      this.mouse = mouse;
      this.camera = camera;
      this.controls = controls;
      this.raycaster = raycaster;

      this.renderer = renderer;
      this.css3DRender = css3DRender;

      this.scene.add(camera);

      this.scene.add(hemiLight);
      this.scene.add(ambientLight);
      this.scene.add(dirLight);
      this.scene.add(dirLightfill);
      this.scene.add(axes);

      this.container.appendChild(renderer.domElement);
      this.container.appendChild(css3DRender.domElement);
    } catch (error) {
      console.warn(error);
    }
  };

  onWindowResize = () => {
    const { container } = this;
    try {
      const { clientWidth, clientHeight } = container;
      this.camera.aspect = clientWidth / clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(clientWidth, clientHeight);
      this.css3DRender.setSize(clientWidth, clientHeight);
    } catch (error) {
      console.warn(error);
    }
  };
}
