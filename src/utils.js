export function debounce(action) {
    let bouncetimer = 0;
    return () => {
        if(bouncetimer) {
            return;
        }

        bouncetimer = setTimeout(() => {
            bouncetimer = null;
        }, 100);
        
        action();
    }
}