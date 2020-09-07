import {useEffect, useRef} from 'react';

export const usePrevious = (x: any) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = x;
	});
	return ref.current;
};
