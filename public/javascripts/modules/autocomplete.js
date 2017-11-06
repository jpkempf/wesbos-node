import { on } from './bling';

export const autocomplete = (input, inputLat, inputLng) => {
    if (!input) return;
    
    input.on('keydown', e => e.keyCode === 13 && e.preventDefault());
    
    const dropdown = new google.maps.places.Autocomplete(input);
    
    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        const geo = place.geometry;

        if (!geo) return;

        const { lat, lng } = geo.location;

        inputLat.value = lat();
        inputLng.value = lng();
    });
};

export default autocomplete;
