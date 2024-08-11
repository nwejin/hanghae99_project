import { Card } from '@ui';

export default function LoginTemplates() {
  return (
    <>
      <Card.Card className="w-[30rem]">
        <Card.CardContent className="flex flex-col gap-y-2 pb-4"></Card.CardContent>
        <Card.CardFooter className="block">
          <div className="mb-2 flex w-full justify-between"></div>
        </Card.CardFooter>
      </Card.Card>
    </>
  );
}
