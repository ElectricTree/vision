import React, { forwardRef, useEffect, useRef } from "react";
import store from "./store";
import useCombinedRefs from "./hooks/useCombinedRefs";

interface iScissorGroupProps {
  uuid: string;
}

const ScissorScene = forwardRef<
  THREE.Scene,
  React.PropsWithChildren<iScissorGroupProps>
>(({ uuid, children, ...rest }, ref) => {
  console.log("render ScissorScene ", uuid);
  const addScene = store((s) => s.addScene);
  const removeScene = store((s) => s.removeScene);
  const localRef = useRef<THREE.Scene>();
  const combinedRef = useCombinedRefs<THREE.Scene>(ref, localRef);
  console.log(localRef);

  useEffect(() => {
    console.log(localRef);
    if (localRef.current) {
      addScene(localRef.current, uuid);
      return () => removeScene(uuid);
    } else {
      return;
    }
  }, [localRef]);

  return (
    <scene {...rest} ref={combinedRef}>
      {children}
    </scene>
  );
});

export default ScissorScene;
