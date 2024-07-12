import styles from './GlobalViewer.module.less';
import { useRef } from 'react';
import { useMount } from 'ahooks';
export default () => {
  const mapDomRef = useRef();

  const mapRef = useRef();

  const initGlobalViewer = () => {};

  useMount(() => {
    initGlobalViewer();
  });
  return (
    <section className={styles['global-viewer']} ref={ref => (mapDomRef.current = ref)}>
      888
    </section>
  );
};
