import Place from '@/models/Place'
import {PlaceInterface} from '@/types/PlaceInterface'

class PlaceMock implements PlaceInterface{
    name = 'Berlin'
    lat = '2.32893283'
    lng = ' 76.549830456'
}

export function getPlaces(): Array<Place> {
    const place1 = new PlaceMock()
    const place2  = new PlaceMock()
    place2.name = 'Maria Oriente'
    const place3  = new PlaceMock()
    place3.name = 'Santa Clara'

    return [place1, place2, place3]
}


export const place =  new PlaceMock()