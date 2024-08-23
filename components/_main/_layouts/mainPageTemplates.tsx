import MainPageSide from '../_elements/mainPageSide';
import MainPage from '../_elements/mainPage';

export default function MainPageTemplates() {
  return (
    <div className="flex h-full w-full justify-evenly">
      <MainPage />
      <MainPageSide />
    </div>
  );
}
