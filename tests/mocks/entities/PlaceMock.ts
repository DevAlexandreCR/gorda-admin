import {PlaceInterface} from '@/types/PlaceInterface'
import Place from '@/models/Place'

class PlaceMock implements PlaceInterface {
    key = 'placeKey'
    name = 'Berlin'
    lat = 2.32893283
    lng = 76.549830456
}

export function getPlaces(): Array<Place> {
    const place1 = new Place()
    place1.name = 'Berlin'
    const place2  = new Place()
    place2.name = 'Maria Oriente'
    const place3  = new Place()
    place3.name = 'Santa Clara'

    return [place1, place2, place3]
}


export const place =  new PlaceMock()