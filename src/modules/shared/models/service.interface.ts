export interface IService {
  init?: (...params: unknown[]) => void;
  destroy?: () => void;
}
