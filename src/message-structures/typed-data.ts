import { PacketReader, PacketSender } from "@/internals";
import _isObject from "lodash/isObject";
import _isArray from "lodash/isArray";

export enum TypedData {
  CHAR = 1,
  LONG,
  INT,
  SHORT,
  DOUBLE,
  FLOAT,
  UINT_64,
  CUSTOM_DATA,
}

export interface IReadCustomData {
  getCustomValue: (reader: PacketReader) => any;
}

export interface IPutCustomData {
  putCustomValue: (values: Object | Object[], sender: PacketSender) => void;
}

export class DataByte implements IReadCustomData, IPutCustomData {
  name: string;
  type: TypedData;
  private _length: number = 1;
  private _realValue;

  constructor(name: string, type: TypedData, length?: number) {
    this.name = name;
    this.type = type;
    if (length) this._length = length;
  }

  putValue(value: any, sender: PacketSender) {
    switch (this.type) {
      case TypedData.LONG: {
        sender.putLong(value || 0);
        break;
      }
      case TypedData.INT: {
        sender.putInt(value || 0);
        break;
      }
      case TypedData.DOUBLE: {
        sender.putDouble(value || 0);
        break;
      }
      case TypedData.SHORT: {
        sender.putShort(value || 0);
        break;
      }
      case TypedData.CHAR: {
        sender.putChar(value || "", this._length);
        break;
      }
      case TypedData.FLOAT: {
        sender.putFloat(value || 0);
        break;
      }
      case TypedData.UINT_64: {
        sender.putUint64T(value || 0);
        break;
      }
      case TypedData.CUSTOM_DATA: {
        if (!_isObject(value) && !_isArray(value)) {
          throw new Error(
            "CUSTOM_DATA requires values represents as an object or array of object"
          );
        }
        this.putCustomValue(value, sender);
        break;
      }
    }
  }

  getValue(reader: PacketReader): any {
    switch (this.type) {
      case TypedData.LONG: {
        this._realValue = reader.getLong();
        break;
      }
      case TypedData.INT: {
        this._realValue = reader.getInt();
        break;
      }
      case TypedData.DOUBLE: {
        this._realValue = reader.getDouble();
        break;
      }
      case TypedData.SHORT: {
        this._realValue = reader.getShort();
        break;
      }
      case TypedData.CHAR: {
        this._realValue = reader.getChar(this._length, true);
        break;
      }
      case TypedData.FLOAT: {
        this._realValue = reader.getFloat();
        break;
      }
      case TypedData.UINT_64: {
        this._realValue = reader.getUint64T();
        break;
      }
      case TypedData.CUSTOM_DATA: {
        this._realValue = this.getCustomValue(reader);
        break;
      }
    }
    return this._realValue;
  }

  getRealValue(): any {
    return this._realValue;
  }

  length(): number {
    switch (this.type) {
      case TypedData.LONG: {
        return 8;
      }
      case TypedData.INT:
      case TypedData.FLOAT: {
        return 4;
      }
      case TypedData.DOUBLE: {
        return 8;
      }
      case TypedData.SHORT: {
        return 2;
      }
      case TypedData.CHAR:
      case TypedData.CUSTOM_DATA: {
        return this._length;
      }
    }
  }

  getCustomValue(reader: PacketReader): any {}
  putCustomValue(values: Object | Object[], sender: PacketSender) {}
}
