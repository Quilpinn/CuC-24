# from collections.abc import Iterable
from typing import Tuple, Iterable, Optional
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

test_posts = [
    {
        "city": "Heidelberg",
        "tags": ["Walzer", "Bachata"],
        "other_stuff": "1"
    },
    {
        "city": "Karlsruhe",
        "tags": ["Salsa", "Bachata"],
        "other_stuff": "1"
    }
]

test_user = {
    "city": "Heidelberg",
    "interests": ["Walzer", "Salsa"]
}


def get_coordinates(city: str) -> Optional[Tuple[float, float]]:
    """
    Get the latitude and longitude coordinates for a given city.
    
    Args:
        city (str): Name of the city
        
    Returns:
        Tuple[float, float]: (latitude, longitude) coordinates; returns None if the city cannot be found / associated with latitude/longitude
    """
    geolocator = Nominatim(user_agent="my_distance_calculator")
    
    try:
        location = geolocator.geocode(city)
        if location is None:
            return None # Could not find coordinates for city
        return (location.latitude, location.longitude)
    except Exception as e:
        return None # Error getting coordinates for city

def distance(city1: str, city2: str) -> float:
    """
    Calculate the distance between two cities in kilometers.
    
    Args:
        city1 (str): Name of the first city
        city2 (str): Name of the second city
        
    Returns:
        float: Distance between cities in kilometers, returns 1000km if distance can't be calculated, except if city1=city2
    """
    if city1 == city2:
        return 0
    
    coords1 = get_coordinates(city1)
    coords2 = get_coordinates(city2)
    
    if coords1 is None or coords2 is None:
        return 1000.0
    
    distance_km = geodesic(coords1, coords2).kilometers
    
    return round(distance_km, 2)



def ratePosts(posts: Iterable[dict], user: dict) -> Iterable[dict]: 
    """
    rate events/posts by how close to the user they are and how much the user is probably interested.
    
    Args:
        posts (list of dicts): List of events/posts where each dict has info on that event/post and must contain keys for "city" and "tags"
        user (dict): Contains user information. Keys for "city" and "interests" must be present
        The posts dicts can NOT have "absoluteDistance", "distanceRating", "totalRating" or "interestRating" keys!
        
    Returns:
        list of dicts: contains the original posts with ratings and the total distance in regards to the given user. 
    """
    
    result = []
    for post in posts[:max(len(posts),250)]:
        # distance rating
        post["absoluteDistance"] = distance(post["city"],user["city"])
        
        if post["absoluteDistance"] == 0:
            post["distanceRating"] = 5
        else:
            post["distanceRating"] = 3.5/(post["absoluteDistance"]**0.3)
        
        # interest rating
        post["interestRating"] = len(list(set(post["tags"]) & set(user["interests"])))
        
        # total rating
        post["totalRating"] = post["interestRating"] + post["distanceRating"]
        
        result.append(post)
            
    
    return result

print(ratePosts(test_posts,test_user))