import DashboardIcon from '@material-ui/icons/Dashboard';
import Debug from 'debug';
import Leaflet from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import { MapControl, MapControlProps, withLeaflet } from 'react-leaflet';

const debug = Debug('Dashboard:OmniPanelControl');

export interface SidePanelControlProps extends MapControlProps {
  show: boolean;
  onShowOmniPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

class SidePanelControl extends MapControl<SidePanelControlProps> {
  constructor(props: SidePanelControlProps) {
    super(props);
    this._container = Leaflet.DomUtil.create('div');
    this._container.className = 'leaflet-bar';
  }

  createLeafletElement(props: SidePanelControlProps): Leaflet.Control {
    debug('createLeafletElement');
    const LeafletControl = Leaflet.Control.extend({
      onAdd: () => {
        this._showContainer(props.show);
        return this._container;
      },
    });
    return new LeafletControl();
  }

  updateLeafletElement(fromProps: SidePanelControlProps, toProps: SidePanelControlProps) {
    super.updateLeafletElement(fromProps, toProps);
    debug('updateLeafletElement');
    const { show, onShowOmniPanel } = toProps;
    this._showContainer(show);
    ReactDOM.render(
      // leaflet css uses `a` element to style controls
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a id="omnipanel-control" href="#" onClick={() => onShowOmniPanel(true)}>
        <DashboardIcon style={{ verticalAlign: 'middle' }} />
      </a>,
      this._container,
    );
  }

  private _container: HTMLElement;

  private _showContainer(show: boolean) {
    if (!show) {
      this._container.setAttribute('style', 'display: none');
    } else {
      this._container.setAttribute('style', '');
    }
  }
}

export default withLeaflet(SidePanelControl);
