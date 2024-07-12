import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

class Viewer {
  constructor({ container, modelUrl, modelBgPath = '', tagDatas = [] }) {
    this.container = container;
    this.modelUrl = modelUrl;
    this.modelBgPath = modelBgPath;
    this.tagDatas = tagDatas || [];

    this.initBase();
  }
}
