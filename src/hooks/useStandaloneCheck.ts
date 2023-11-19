import { useEffect, useState } from 'react';

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}


const useStandaloneCheck = () => {
	const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  useEffect(() => {
    const isRunningStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isRunningStandalone);
  }, []);

  return isStandalone;
};

export default useStandaloneCheck;
