import MainPageSide from '../sections/mainPageSide';
import MainPage from '../sections/mainPage';

export function Container() {
  return (
    <div className="flex h-full w-full justify-evenly">
      <MainPage />
      <MainPageSide />
    </div>
  );
}
