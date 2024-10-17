import MainPageSide from '../sections/mainPageSide';
import MainPage from '../sections/mainPage';

export function Container() {
  return (
    <div className="grid grid-cols-[0.5fr_3fr_2fr_0.5fr] gap-2">
      <div></div>

      <MainPage />

      <MainPageSide />

      <div></div>
    </div>
  );
}

// flex h-full w-full justify-evenly
