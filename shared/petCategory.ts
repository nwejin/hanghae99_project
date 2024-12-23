interface PetSubSpeciesType {
  value: string;
  label: string;
}
interface PetCategoryType {
  [key: string]: PetSubSpeciesType[];
}

export const petCategoryData: PetCategoryType = {
  dog: [
    { value: 'retriever', label: '리트리버' },
    { value: 'cocker_spaniel', label: '코카스파니엘' },
    { value: 'beagle', label: '비글' },
    { value: 'welsh_corgi', label: '웰시코기' },
    { value: 'siberian_husky', label: '시베리안 허스키' },
    { value: 'samoyed', label: '사모예드' },
  ],
  cat: [
    { value: 'siamese', label: '샴' },
    { value: 'munchkin', label: '먼치킨' },
    { value: 'norwegian_forest', label: '노르웨이숲' },
  ],
  other: [
    { value: 'hamster', label: '햄스터' },
    { value: 'hedgehog', label: '고슴도치' },
    { value: 'meerkat', label: '미어캣' },
    { value: 'alligator', label: '악어' },
  ],
};

export function getPetLabel(petSpecies: string, petSubSpecies: string): string {
  const speciesList = petCategoryData[petSpecies];

  if (!speciesList) {
    return '알 수 없음'; // petSpecies가 존재하지 않을 때 처리
  }

  const pet = speciesList.find((item) => item.value === petSubSpecies);

  return pet ? pet.label : '알 수 없음'; // 해당하는 label을 찾으면 반환, 없으면 '알 수 없음' 반환
}
