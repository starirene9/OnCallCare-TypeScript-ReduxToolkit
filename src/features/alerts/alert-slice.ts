/**
 * alert-slice.ts
 * ───────────────
 * • “알림(Alert)” 데이터를 Redux 스토어에 저장·조회하는 전용 slice
 * • 구조
 *     byId       : { alertId → AlertEntry }
 *     byPatient  : { patientId → alertId[] }  (인덱스 역할)
 */
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store"; // selector용

/* ------------------------------------------------------------------ */
/* 1. 타입 정의                                                        */
/* ------------------------------------------------------------------ */

/** Drawer가 넘겨주는 파라미터 형태 */
export interface AlertInput {
  doctorId: string;
  patientId: string;
  offsets: number[]; // 예) [30] or [60] or []
  notes: string;
}

/** 실제 스토어에 저장될 Alert 엔트리 */
export interface AlertEntry extends AlertInput {
  id: string; // nanoid() 로 생성
  createdAt: string; // ISO-8601 타임스탬프
}

interface AlertsState {
  /** alertId → AlertEntry (상세 데이터) */
  byId: Record<string, AlertEntry>;

  /** patientId → alertId[]
   *  - “해당 환자에 알림이 있는가?” 를 O(1) 로 체크하기 위한 인덱스
   */
  byPatient: Record<string, string[]>;
}

const initialState: AlertsState = { byId: {}, byPatient: {} };

/* ------------------------------------------------------------------ */
/* 2. Slice 정의                                                       */
/* ------------------------------------------------------------------ */

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    /* ────────────────────────────────────────────────────────────────
     * addAlert
     *  • Drawer에서 “Create Alert” 누를 때 호출
     *  • Immer 덕분에 state를 ‘직접’ 수정해도 불변성이 유지됩니다.
     *  • prepare() 콜백에서 id / createdAt 자동 부여
     * ────────────────────────────────────────────────────────────── */
    addAlert: {
      /* 실제 reducer 로직 */
      reducer(state, action: PayloadAction<AlertEntry>) {
        const alert = action.payload;

        /* 1) 상세 저장 */
        state.byId[alert.id] = alert;

        /* 2) 인덱스 갱신 */
        (state.byPatient[alert.patientId] ??= []).push(alert.id);
      },

      /* prepare: nanoid/타임스탬프를 추가하고 payload를 만들어 반환 */
      prepare(input: AlertInput) {
        return {
          payload: {
            ...input,
            id: nanoid(), // 고유 ID
            createdAt: new Date().toISOString(),
          } satisfies AlertEntry,
        };
      },
    },

    /* ────────────────────────────────────────────────────────────────
     * removeAlert
     *  • alertId 로 삭제
     *  • byId / byPatient 양쪽 모두에서 정리
     * ────────────────────────────────────────────────────────────── */
    removeAlert(state, action: PayloadAction<string>) {
      const id = action.payload;
      const alert = state.byId[id];
      if (!alert) return; // 이미 없는 경우 안전 탈출

      /* patient 인덱스에서 제거 */
      state.byPatient[alert.patientId] = state.byPatient[
        alert.patientId
      ].filter((aid) => aid !== id);
      if (state.byPatient[alert.patientId].length === 0) {
        delete state.byPatient[alert.patientId]; // 빈 배열 정리
      }

      /* 상세 데이터 제거 */
      delete state.byId[id];
    },

    /* (선택) 알림 내용 일부 수정 */
    updateAlert(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<AlertEntry, "id" | "createdAt">>;
      }>
    ) {
      const { id, changes } = action.payload;
      if (state.byId[id]) {
        Object.assign(state.byId[id], changes); // Immer mutating
      }
    },
  },
});

/* 액션과 리듀서 export */
export const { addAlert, removeAlert, updateAlert } = alertsSlice.actions;
export default alertsSlice.reducer;

/* ------------------------------------------------------------------ */
/* 3. Selector: 환자별 알림 여부                                        */
/* ------------------------------------------------------------------ */

/**
 * selectHasAlert(state, patientId)
 *  • 특정 환자에게 등록된 alert 가 하나라도 있으면 true
 *  • AlertTable에서 “⭕/❌” 아이콘 계산에 사용
 */
export const selectHasAlert = (state: RootState, patientId: string) =>
  Boolean(state.alerts.byPatient[patientId]?.length);

export const selectLatestAlertForPatient =
  (patientId: string) => (state: RootState) => {
    const ids = state.alerts.byPatient[patientId];
    if (!ids?.length) return null;
    const latestId = ids[ids.length - 1]; // push 순서 그대로면 마지막이 최신
    return state.alerts.byId[latestId] ?? null;
  };
