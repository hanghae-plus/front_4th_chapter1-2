/** @jsx createVNode */
import { createVNode } from "../lib";

export const TestPage = () => (
  <main className="bg-gray-100 flex items-center justify-center min-h-screen">
    <div className="bg-white p-8 rounded-lg text-center">
      <h3 className="text-blue-600">TEST PAGE</h3>
      {null}
      <p>테스트를 해볼수 있습니다</p>
    </div>
  </main>
);
