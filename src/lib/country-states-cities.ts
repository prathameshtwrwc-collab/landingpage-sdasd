export interface StateData {
  name: string;
  cities: string[];
}

export interface CountryStates {
  [countryName: string]: StateData[];
}

export const COUNTRY_STATES: CountryStates = {
  India: [
    { name: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"] },
    { name: "Arunachal Pradesh", cities: ["Itanagar", "Naharlagun"] },
    { name: "Assam", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"] },
    { name: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"] },
    { name: "Chhattisgarh", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba"] },
    { name: "Goa", cities: ["Panaji", "Vasco da Gama", "Margao"] },
    { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"] },
    { name: "Haryana", cities: ["Gurgaon", "Faridabad", "Panipat", "Ambala"] },
    { name: "Himachal Pradesh", cities: ["Shimla", "Dharamshala", "Mandi"] },
    { name: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"] },
    { name: "Karnataka", cities: ["Bangalore", "Mysore", "Mangalore", "Hubli"] },
    { name: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"] },
    { name: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur"] },
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"] },
    { name: "Manipur", cities: ["Imphal"] },
    { name: "Meghalaya", cities: ["Shillong", "Tura"] },
    { name: "Mizoram", cities: ["Aizawl"] },
    { name: "Nagaland", cities: ["Kohima", "Dimapur"] },
    { name: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela"] },
    { name: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"] },
    { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota"] },
    { name: "Sikkim", cities: ["Gangtok"] },
    { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"] },
    { name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad"] },
    { name: "Tripura", cities: ["Agartala"] },
    { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"] },
    { name: "Uttarakhand", cities: ["Dehradun", "Haridwar", "Haldwani"] },
    { name: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri"] },
    { name: "Andaman and Nicobar Islands", cities: ["Port Blair"] },
    { name: "Chandigarh", cities: ["Chandigarh"] },
    { name: "Dadra and Nagar Haveli", cities: ["Silvassa"] },
    { name: "Daman and Diu", cities: ["Daman", "Diu"] },
    { name: "Lakshadweep", cities: ["Kavaratti"] },
    { name: "Delhi", cities: ["New Delhi", "Delhi"] },
    { name: "Puducherry", cities: ["Pondicherry", "Oulgaret"] },
  ],
  "United States": [
    { name: "Alabama", cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville"] },
    { name: "Alaska", cities: ["Anchorage", "Fairbanks", "Juneau"] },
    { name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Chandler"] },
    { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"] },
    { name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora"] },
    { name: "Connecticut", cities: ["Hartford", "New Haven", "Bridgeport"] },
    { name: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville"] },
    { name: "Georgia", cities: ["Atlanta", "Augusta", "Savannah"] },
    { name: "Illinois", cities: ["Chicago", "Springfield", "Naperville"] },
    { name: "Massachusetts", cities: ["Boston", "Cambridge", "Worcester"] },
    { name: "Michigan", cities: ["Detroit", "Grand Rapids", "Ann Arbor"] },
    { name: "Nevada", cities: ["Las Vegas", "Reno", "Henderson"] },
    { name: "New York", cities: ["New York City", "Buffalo", "Rochester", "Albany"] },
    { name: "North Carolina", cities: ["Charlotte", "Raleigh", "Durham"] },
    { name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati"] },
    { name: "Oregon", cities: ["Portland", "Salem", "Eugene"] },
    { name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Harrisburg"] },
    { name: "Texas", cities: ["Houston", "Austin", "Dallas", "San Antonio"] },
    { name: "Washington", cities: ["Seattle", "Tacoma", "Spokane"] },
    { name: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay"] },
  ],
  "United Kingdom": [
    { name: "England", cities: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"] },
    { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"] },
    { name: "Wales", cities: ["Cardiff", "Swansea", "Newport"] },
    { name: "Northern Ireland", cities: ["Belfast", "Derry", "Lisburn"] },
  ],
  Canada: [
    { name: "Alberta", cities: ["Calgary", "Edmonton", "Red Deer"] },
    { name: "British Columbia", cities: ["Vancouver", "Victoria", "Surrey"] },
    { name: "Manitoba", cities: ["Winnipeg", "Brandon"] },
    { name: "New Brunswick", cities: ["Fredericton", "Moncton", "Saint John"] },
    { name: "Nova Scotia", cities: ["Halifax", "Sydney"] },
    { name: "Ontario", cities: ["Toronto", "Ottawa", "Mississauga", "Hamilton"] },
    { name: "Quebec", cities: ["Montreal", "Quebec City", "Laval"] },
    { name: "Saskatchewan", cities: ["Saskatoon", "Regina"] },
  ],
  Australia: [
    { name: "New South Wales", cities: ["Sydney", "Newcastle", "Wollongong"] },
    { name: "Victoria", cities: ["Melbourne", "Geelong", "Ballarat"] },
    { name: "Queensland", cities: ["Brisbane", "Gold Coast", "Sunshine Coast"] },
    { name: "Western Australia", cities: ["Perth", "Fremantle"] },
    { name: "South Australia", cities: ["Adelaide", "Mount Gambier"] },
    { name: "Tasmania", cities: ["Hobart", "Launceston"] },
  ],
  "United Arab Emirates": [
    { name: "Abu Dhabi", cities: ["Abu Dhabi", "Al Ain"] },
    { name: "Dubai", cities: ["Dubai"] },
    { name: "Sharjah", cities: ["Sharjah"] },
    { name: "Ajman", cities: ["Ajman"] },
    { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
  ],
  "Saudi Arabia": [
    { name: "Riyadh", cities: ["Riyadh"] },
    { name: "Makkah", cities: ["Jeddah", "Mecca"] },
    { name: "Madinah", cities: ["Medina"] },
    { name: "Eastern Province", cities: ["Dammam", "Khobar"] },
  ],
  Singapore: [
    { name: "Central Region", cities: ["Singapore"] },
  ],
  Germany: [
    { name: "Bavaria", cities: ["Munich", "Nuremberg", "Augsburg"] },
    { name: "Berlin", cities: ["Berlin"] },
    { name: "Hamburg", cities: ["Hamburg"] },
    { name: "North Rhine-Westphalia", cities: ["Cologne", "Dusseldorf", "Dortmund"] },
    { name: "Hesse", cities: ["Frankfurt", "Wiesbaden"] },
    { name: "Baden-Wurttemberg", cities: ["Stuttgart", "Karlsruhe"] },
  ],
  France: [
    { name: "Île-de-France", cities: ["Paris", "Versailles"] },
    { name: "Provence-Alpes-Côte d'Azur", cities: ["Marseille", "Nice", "Toulon"] },
    { name: "Auvergne-Rhône-Alpes", cities: ["Lyon", "Grenoble"] },
    { name: "Nouvelle-Aquitaine", cities: ["Bordeaux"] },
  ],
  Japan: [
    { name: "Tokyo", cities: ["Tokyo", "Chiyoda", "Shibuya"] },
    { name: "Osaka", cities: ["Osaka", "Sakai"] },
    { name: "Kyoto", cities: ["Kyoto"] },
    { name: "Hokkaido", cities: ["Sapporo"] },
  ],
};

export function getStatesForCountry(countryName: string): string[] {
  const data = COUNTRY_STATES[countryName];
  return data ? data.map((s) => s.name) : [];
}

export function getCitiesForState(countryName: string, stateName: string): string[] {
  const data = COUNTRY_STATES[countryName];
  if (!data) return [];
  const state = data.find((s) => s.name === stateName);
  return state ? state.cities : [];
}
