import MainPageSide from '../sections/mainPageSide';
import MainPage from '../sections/mainPage';

export function Container() {
  return (
    <div className="flex items-center justify-center">
      <MainPage />

      {/* <MainPageSide /> */}
    </div>
  );
}

// flex h-full w-full justify-evenly
