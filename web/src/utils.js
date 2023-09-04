export function debounce(action) {
    if(!action) return undefined;
    
    let bouncetimer = 0;
    return (...args) => {
        if(bouncetimer) {
            return;
        }

        bouncetimer = setTimeout(() => {
            bouncetimer = null;
        }, 100);
        
        action(...args);
    }
}